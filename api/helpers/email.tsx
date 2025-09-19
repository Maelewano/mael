import { Html } from '@react-email/html';
import { Text } from '@react-email/text';
import * as React from 'react';
import { EmailInformation } from '@/lib/types/emailInformation.types';

export function Email(emailInformation: EmailInformation) {
    return (
        <Html lang="en">
            <Text>Hi,</Text>
            <Text>You are invited to our Meeting.</Text>
            <Text>Date: {emailInformation.startDate}</Text>
            <Text>Location: {emailInformation.url}</Text>
            <Text>Open the attached file to add this event to your calendar.</Text>
        </Html>
    );
}

export default Email;