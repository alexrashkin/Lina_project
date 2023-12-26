from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (FavoriteViewSet, IngredientsViewset, WorksViewset,
                    TagViewset, UserViewset)

app_name = 'api'

router = DefaultRouter()

router.register('works', WorksViewset, basename='works')
router.register('ingredients', IngredientsViewset, basename='ingredients')
router.register('tags', TagViewset, basename='tags')
router.register('users', UserViewset, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('works/<int:pk>/shopping_cart/',
         WorksViewset.as_view({
             'post': 'shopping_cart',
             'delete': 'shopping_cart'
         }), name='shopping_cart'),
    path('works/<int:pk>/favorite/',
         FavoriteViewSet.as_view({
             'post': 'favorite',
             'delete': 'favorite'
         }), name='favorite'),
]
