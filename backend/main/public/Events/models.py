from django.db import models
import nepali_datetime
from ..Gallery.models import GalleryAlbum

class Event(models.Model):
    title = models.CharField(max_length=255)
    details = models.TextField()
    cover_image = models.ImageField(upload_to='event_covers/')

    # Using CharField for more flexible BS date input
    event_date_bs = models.CharField(
        max_length=10,
        help_text="Nepali (BS) Date in YYYY-MM-DD format"
    )

    # Auto-converted Gregorian date
    event_date_ad = models.DateField(blank=True, null=True, editable=False)

    gallery_album = models.ForeignKey(
        GalleryAlbum,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Link to gallery album after event"
    )

    class Meta:
        ordering = ['-event_date_ad']  # Newest events first
        db_table = 'events'

    def save(self, *args, **kwargs):
        """Convert BS date to AD date automatically on save"""
        if self.event_date_bs:
            try:
                bs_parts = self.event_date_bs.split('-')
                if len(bs_parts) == 3:
                    bs_year, bs_month, bs_day = map(int, bs_parts)
                    bs_date = nepali_datetime.date(bs_year, bs_month, bs_day)
                    self.event_date_ad = bs_date.to_datetime_date()
            except (ValueError, IndexError, AttributeError) as e:
                print(f"Date conversion error: {e}")
                self.event_date_ad = None
        super().save(*args, **kwargs)

    def is_upcoming(self):
        """Check if event is in the future (BS date)"""
        try:
            today_bs = nepali_datetime.date.today()
            bs_parts = self.event_date_bs.split('-')
            if len(bs_parts) == 3:
                event_bs = nepali_datetime.date(
                    int(bs_parts[0]), 
                    int(bs_parts[1]), 
                    int(bs_parts[2])
                )
                return event_bs >= today_bs
        except Exception:
            return False
        except Exception:
            return False
        return False

    def is_past(self):
        """Check if event has passed (BS date)"""
        return not self.is_upcoming()

    @property
    def formatted_bs_date(self):
        """Return nicely formatted BS date"""
        try:
            bs_parts = self.event_date_bs.split('-')
            if len(bs_parts) == 3:
                return f"{bs_parts[0]}-{bs_parts[1]}-{bs_parts[2]}"
        except Exception:
            return ""
        return ""

    def __str__(self):
        return f"{self.title} ({self.formatted_bs_date})"

    def clean(self):
        """Validate the BS date format"""
        super().clean()
        if self.event_date_bs:
            try:
                parts = self.event_date_bs.split('-')
                if len(parts) != 3:
                    raise ValueError("Date must be in YYYY-MM-DD format")
                year, month, day = map(int, parts)
                # Validate by trying to create a date object
                nepali_datetime.date(year, month, day)
            except ValueError as e:
                raise ValueError(f"Invalid BS date: {e}")