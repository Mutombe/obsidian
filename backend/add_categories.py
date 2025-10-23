#!/usr/bin/env python
"""
Add missing sport categories (simplified version)
Run with: python manage.py shell < add_categories_simple.py
"""

from core.models import SportCategory

print("Adding missing sport categories...")

# Add Golf (only using 'name' field)
try:
    golf, golf_created = SportCategory.objects.get_or_create(name='golf')
    if golf_created:
        print("✓ Golf category created")
    else:
        print("- Golf category already exists")
except Exception as e:
    print(f"✗ Error creating golf: {e}")

# Add Boxing (only using 'name' field)
try:
    boxing, boxing_created = SportCategory.objects.get_or_create(name='boxing')
    if boxing_created:
        print("✓ Boxing category created")
    else:
        print("- Boxing category already exists")
except Exception as e:
    print(f"✗ Error creating boxing: {e}")

# Display all categories
try:
    print(f"\nTotal sport categories: {SportCategory.objects.count()}")
    print("Available categories:")
    for cat in SportCategory.objects.all():
        print(f"  - {cat.name}")
except Exception as e:
    print(f"Error listing categories: {e}")