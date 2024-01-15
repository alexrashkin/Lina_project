import logging

from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from djoser.views import UserViewSet
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.models import User
from works.models import Favorite, Material, Tag, Work

from .filters import MaterialFilter, WorkFilter
from .permissions import IsAdminUserOrReadOnly, IsOwnerAdmin
from .serializers import (FavoriteSerializer, MaterialSerializer,
                          TagSerializer, UserSerializer, WorkGetSerializer,
                          WorkSaveSerializer)

logger = logging.getLogger(__name__)


class MaterialsViewset(mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       viewsets.GenericViewSet):
    """
    Вьюсет для материалов.
    Позволяет получать список материалов и детали отдельных материалов.
    """

    queryset = Material.objects.all()
    model = Material
    serializer_class = MaterialSerializer
    permission_classes = (IsAdminUserOrReadOnly,)
    filter_backends = (DjangoFilterBackend,)
    pagination_class = None
    filterset_class = MaterialFilter


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    Вьюсет для избранных работ.
    Позволяет получать, создавать, изменять и удалять избранные работы.
    """

    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Получает избранные работы для текущего пользователя.
        """

        user = self.request.user
        return Favorite.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Создаёт новую избранную работу для текущего пользователя.
        """

        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        """
        Удаляет избранную работу текущего пользователя.
        """

        if instance.user == self.request.user:
            instance.delete()

    @action(methods=['POST', 'DELETE'], detail=True,
            permission_classes=[IsAuthenticated])
    def favorite(self, request, pk):
        """
        Добавляет или удаляет работу из избранного для пользователя.
        """

        work = get_object_or_404(Work, id=pk)

        if request.method == 'POST':
            context = {'request': request}
            work = get_object_or_404(Work, id=pk)
            data = {
                'user': request.user.id,
                'work': work.id
            }

            serializer = FavoriteSerializer(data=data, context=context)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'DELETE':
            deleted_favs = Favorite.objects.filter(
                user=request.user, work=work).delete()

            if deleted_favs[0] == 0:
                return Response(status=status.HTTP_404_NOT_FOUND)

            return Response(status=status.HTTP_204_NO_CONTENT)


class WorksViewset(viewsets.ModelViewSet):
    """
    Вьюсет для работ.
    Позволяет получать список работ, создавать, изменять и удалять работы.
    Может добавлять и удалять работы из избранного.
    """

    queryset = Work.objects.all()
    filter_backends = (DjangoFilterBackend,)
    ordering = ['-pub_date']
    pagination_class = PageNumberPagination
    filterset_class = WorkFilter

    def get_queryset(self):
        """
        Получает список работ в зависимости от параметров запроса.
        """

        is_favorited = self.request.query_params.get('is_favorited')
        if is_favorited is not None and int(is_favorited) == 1:
            return Work.objects.filter(favorites__user=self.request.user)
        return Work.objects.all()

    def create(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise PermissionDenied(detail="Only admin can do that")
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        Создает новую работу и связывает с текущим пользователем как автором.
        """
        serializer.save(author=self.request.user)

    def get_serializer_class(self):
        """
        Возвращает соответствующий сериализатор в зависимости от метода
        запроса.
        """

        if self.action == 'list' or self.action == 'retrieve':
            return WorkGetSerializer
        return WorkSaveSerializer

    def destroy(self, request, *args, **kwargs):
        # Удаляет работу

        instance = self.get_object()
        if not request.user.is_superuser:
            raise PermissionDenied(detail="Only admin can do that")

        self.perform_destroy(instance)
        return Response('Работа успешно удалена',
                        status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post', 'delete'], detail=True,
            permission_classes=(IsOwnerAdmin,))
    def favorites(self, request, pk):
        """
        Добавляет или удаляет работу из избранного для пользователя.
        POST - добавление в избранное, DELETE - удаление из избранного.
        """

        work = get_object_or_404(Work, id=pk)
        if request.method == 'POST':
            if Favorite.objects.filter(user=request.user,
                                       work=work).exists():
                return Response({'detail': 'Работа уже добавлена в избранное'},
                                status=status.HTTP_400_BAD_REQUEST)
            new_fav = Favorite.objects.create(user=request.user, work=work)
            serializer = FavoriteSerializer(new_fav,
                                            context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        if request.method == 'DELETE':
            old_fav = get_object_or_404(Favorite,
                                        user=request.user,
                                        work=work)
            self.perform_destroy(old_fav)
            return Response(status=status.HTTP_204_NO_CONTENT)
        raise MethodNotAllowed(request.method)


class TagViewset(mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):
    """
    Вьюсет для тегов.
    Позволяет получать список тегов и детали отдельных тегов.
    """

    queryset = Tag.objects.filter(~Q(color="srv"))
    serializer_class = TagSerializer
    permission_classes = (IsAdminUserOrReadOnly,)
    pagination_class = None


class UserViewset(UserViewSet):
    """
    Вьюсет для работы с пользователем.
    Позволяет получать список пользователей и детали отдельных пользователей.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer


class CheckSuperuserStatusView(APIView):

    def get(self, request, *args, **kwargs):
        is_superuser = request.user.is_superuser
        return JsonResponse({'is_superuser': is_superuser})
