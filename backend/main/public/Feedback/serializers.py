# serializers.py
from rest_framework import serializers
from .models import  ContactFeedback



class ContactFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactFeedback
        fields = ['date', 'time', 'name', 'email', 'message']