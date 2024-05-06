import React from 'react';

const CallbackPage: React.FC = () => {
  // Handle callback logic here
    const params = new URLSearchParams(window.location.search);
    var message: string | null = "message"
    const error = params.get("error");
    if (error) {
        message = params.get("message");

        // Error, a localized user-displayable error message is available in `message`
    } else {
        message = params.get("code");
    // Success, continue by sending `code` or any other success response parameters to your backend service
    // Refer to the Tink Link API Reference for the respective product you are using.
    }
    return (
        <div>
            <h1>Callback from the bank</h1>
            {message}
        </div>
    );
}

export default CallbackPage;