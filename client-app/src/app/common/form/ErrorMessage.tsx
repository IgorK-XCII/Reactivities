import { AxiosResponse } from 'axios';
import React from 'react';
import { Message } from 'semantic-ui-react';

interface IProps {
    error: AxiosResponse,
    text?: string
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
    const {data} = error;
    return (
        <Message error>
            <Message.Header>{error.statusText}</Message.Header>
            {data && Object.keys(data.errors).length && (
                <Message.List>
                    {Object.values(data.errors).flat().map((err: any, i) => (
                        <Message.Item key={i}>{err}</Message.Item>
                    ))}
                </Message.List>
            )}
            {text && <Message.Content content={text} />}
        </Message>
    );
};

export default ErrorMessage;
