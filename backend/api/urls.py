from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (FavoriteViewSet, MaterialsViewset, TagViewset, UserViewset,
                    WorksViewset)

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
    path('works/<int:pk>/favorite/',
         FavoriteViewSet.as_view({
             'post': 'favorite',
             'delete': 'favorite'
         }), name='favorite'),
]
