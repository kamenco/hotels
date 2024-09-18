from django.shortcuts import render, redirect, reverse, HttpResponse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect


def view_bag(request):
    """ A view that renders the bag contents page """

    return render(request, 'bag/bag.html')

def add_to_bag(request, item_id):
    """ Add a quantity of the specified product to the shopping bag """

    quantity = int(request.POST.get('quantity'))
    redirect_url = request.POST.get('redirect_url')
    bag = request.session.get('bag', {})

    if item_id in list(bag.keys()):
        bag[item_id] += quantity
    else:
        bag[item_id] = quantity

    request.session['bag'] = bag
    return redirect(redirect_url)

def remove_from_bag(request, item_id):
    """Remove an item from the shopping bag"""
    try:
        # Get the shopping bag from the session
        bag = request.session.get('bag', {})

        # Check if the item is in the bag and remove it
        if item_id in bag:
            del bag[item_id]
            request.session['bag'] = bag  # Update the session with the new bag data
            return JsonResponse({'success': True})

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})