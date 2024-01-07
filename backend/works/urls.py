from api.views import (FavoriteViewSet, MaterialsViewset, TagViewset,
                       WorksViewset)
from django.urls import include, path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('works', WorksViewset, basename='works')
router.register('materials', MaterialsViewset, basename='materials')
router.register('tags', TagViewset, basename='tags')
router.register('favorite', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('', include(router.urls)),
]
