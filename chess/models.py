from django.db import models

class Move(models.Model):
    move = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.move