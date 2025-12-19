from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, InvoiceSerializer, MessageTemplateSerializer
# from .sms_service import send_sms

# Create your views here.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })

class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Delete the token to force a login
            request.user.auth_token.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception:
            # If the token is already gone or invalid, just return 204
            return Response(status=status.HTTP_204_NO_CONTENT)

class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return self.request.user.invoices.all()

    def perform_create(self, serializer):
        user = self.request.user
        # Check if user is PRO
        is_pro = getattr(user, 'profile', None) and user.profile.is_pro
        
        if not is_pro:
            # Count existing invoices
            invoice_count = user.invoices.count()
            if invoice_count >= 5:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Invoice limit reached. Upgrade to PRO for unlimited invoices.")
        
        serializer.save(user=user)

class UserStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        is_pro = getattr(user, 'profile', None) and user.profile.is_pro
        invoice_count = user.invoices.count()
        
        return Response({
            "is_pro": is_pro,
            "invoice_count": invoice_count,
            "limit": 5
        })

class MessageTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageTemplateSerializer

    def get_queryset(self):
        return self.request.user.message_templates.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# class SendSMSView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         phone_number = request.data.get('phone_number')
#         message = request.data.get('message')

#         if not phone_number or not message:
#             return Response(
#                 {"error": "phone_number and message are required"}, 
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         success, detail = send_sms(phone_number, message)
        
#         if success:
#             return Response({"message": "SMS sent successfully"})
#         else:
#             return Response(
#                 {"error": f"Failed to send SMS: {detail}"}, 
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class CreateUpgradeTestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        if profile:
            profile.is_pro = True
            profile.save()
            return Response({"message": "Successfully upgraded to PRO (Test Mode)"})
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
