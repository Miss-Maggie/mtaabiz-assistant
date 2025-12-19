from django.urls import path
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('invoices', views.InvoiceViewSet, basename='invoices')
router.register('messages', views.MessageTemplateViewSet, basename='messages')

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/user/', views.UserView.as_view(), name='user'),
    path('auth/status/', views.UserStatusView.as_view(), name='user-status'),
    path('auth/upgrade-test/', views.CreateUpgradeTestView.as_view(), name='upgrade-test'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    # path('messages/send-sms/', views.SendSMSView.as_view(), name='send-sms'),
] + router.urls
