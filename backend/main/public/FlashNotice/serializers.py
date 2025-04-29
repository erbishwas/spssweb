from django.db import models

class FlashNotice(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    image = models.ImageField(upload_to='flash_notices/')
    trun_flash_On = models.BooleanField(default=True)

    class Meta:
        db_table = 'flash_notice'

    def __str__(self):
        return self.title