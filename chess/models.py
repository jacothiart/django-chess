from django.db import models
from django.contrib.auth.models import User

class Invitation(models.Model):
    from_user = models.ForeignKey(User, related_name='from_user')
    to_user = models.ForeignKey(User, related_name='to_user')
    accepted = models.BooleanField()
    rejected = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)
    
class Move(models.Model):
    user = models.ForeignKey(User)
    invitation = models.ForeignKey(Invitation)
    move = models.CharField(max_length=255)
    fromXY = models.PositiveSmallIntegerField()
    toXY = models.PositiveSmallIntegerField()
    created = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.move