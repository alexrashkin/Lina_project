from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (FavoriteViewSet, MaterialsViewset, TagViewset, UserViewset,
                    WorksViewset, CheckSuperuserStatusView)

app_name = 'api'

router = DefaultRouter()

router.register('works', WorksViewset, basename='works')
router.register('materials', MaterialsViewset, basename='materials')
router.register('tags', TagViewset, basename='tags')
router.register('users', UserViewset, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('check-superuser-status/', CheckSuperuserStatusView.as_view(), name='check_superuser_status'),
    path('works/<int:pk>/favorite/',
         FavoriteViewSet.as_view({
             'post': 'favorite',
             'delete': 'favorite'
         }), name='favorite'),
]
