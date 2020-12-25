import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { DateTimePicker } from 'react-widgets';
import { Form, FormFieldProps, Label } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps { }

const DateInput: React.FC<IProps> = ({
    id = null,
    input: { value, onChange, onBlur },
    width,
    type,
    placeholder,
    meta: { touched, error },
    ...rest
}) => (
    <Form.Field error={touched && !!error} type={type} width={width}>
        <DateTimePicker
            placeholder={placeholder}
            value={value || null}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={(e) => e.preventDefault()}
            messages={{}}
            {...rest}
        />
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
);

export default DateInput;
