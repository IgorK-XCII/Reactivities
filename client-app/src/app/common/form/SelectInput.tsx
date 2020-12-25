import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Label, Select } from 'semantic-ui-react';

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps { }

const SelectInput: React.FC<IProps> = ({
    input: { value, onChange },
    width,
    type,
    options,
    rows,
    placeholder,
    meta: { touched, error }
}) => (
    <Form.Field error={touched && !!error} type={type} width={width}>
        <Select
            value={value}
            onChange={(e, data) => onChange(data.value)}
            placeholder={placeholder}
            options={options}
        />
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
);

export default SelectInput;
