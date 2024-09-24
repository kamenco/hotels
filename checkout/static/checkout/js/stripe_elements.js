/*
    Core logic/payment flow for this comes from here:
    https://stripe.com/docs/payments/accept-a-payment

    CSS from here: 
    https://stripe.com/docs/stripe-js
*/

var stripePublicKey = $('#id_stripe_public_key').text();
var clientSecret = $('#id_client_secret').text();
var stripe = Stripe(stripePublicKey);
var elements = stripe.elements();
var style = {
    base: {
        color: '#000',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
    }
};

var card = elements.create('card', {style: style});
card.mount('#card-element');

// Handle realtime validation errors on the card element
card.addEventListener('change', function (event) {
    var errorDiv = document.getElementById('card-errors');
    if (event.error) {
        var html = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${event.error.message}</span>
        `;
        $(errorDiv).html(html);
    } else {
        errorDiv.textContent = '';
    }
});

// Handle form submit
var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    card.update({ 'disabled': true});
    $('#submit-button').attr('disabled', true);
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
        }
    }).then(function(result) {
        if (result.error) {
            var errorDiv = document.getElementById('card-errors');
            var html = `
                <span class="icon" role="alert">
                <i class="fas fa-times"></i>
                </span>
                <span>${result.error.message}</span>`;
            $(errorDiv).html(html);
            card.update({ 'disabled': false});
            $('#submit-button').attr('disabled', false);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                form.submit();
            }
        }
    });
});
// stripe.confirmCardPayment
stripe.confirmCardPayment(clientSecret, {
    payment_method: {
        card: card,
        billing_details: {
            name: 'Customer Name',
        },
    },
}).then(function(result) {
    if (result.error) {
        // Handle error here
    } else {
        if (result.paymentIntent.status === 'succeeded') {
            // Payment successful, handle success
        }
    }
});

/*
var stripe = Stripe(document.getElementById('id_stripe_public_key').textContent);
var clientSecret = document.getElementById('id_client_secret').textContent;

// Confirm the card payment using the clientSecret
stripe.confirmCardPayment(clientSecret, {
    payment_method: {
        card: cardElement,
        billing_details: {
            name: 'Cardholder Name',
        },
    }
}).then(function(result) {
    if (result.error) {
        // Show error to your customer
        console.error(result.error.message);
    } else {
        if (result.paymentIntent.status === 'succeeded') {
            // The payment was successful
            console.log("Payment successful!");
        }
    }
});
*/