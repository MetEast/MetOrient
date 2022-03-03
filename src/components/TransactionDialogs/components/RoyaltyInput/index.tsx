import React, { useState } from 'react';
import { Stack, Box, Typography, TextField } from '@mui/material';
import { SxProps } from '@mui/system';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
    error?: boolean;
    errorText?: string;
    sx?: SxProps;
    handleChange?: (value: string) => void;
}

const RoyaltyInput: React.FC<ComponentProps> = ({
    title,
    placeholder,
    error = false,
    errorText = '',
    sx,
    handleChange = () => {},
}): JSX.Element => {
    const [text, setText] = useState('10');
    const [invalid, setInvalid] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setText(value);
        handleChange(value);
        setInvalid(value === '' || isNaN(Number(value)) || Number(value) <= 0 || Number(value) >= 100);
    };

    return (
        <Stack spacing={0.5} sx={{ ...sx }}>
            {title && (
                <Typography fontSize={12} fontWeight={700}>
                    {title}
                </Typography>
            )}
            <Box position="relative">
                <TextField
                    value={text}
                    placeholder={placeholder}
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        '& .MuiOutlinedInput-root': {
                            height: 40,
                            fontSize: 20,
                            fontWeight: 500,
                            '& fieldset, &:hover fieldset': {
                                borderWidth: error && invalid ? 2 : 0,
                                borderColor: error && invalid ? '#EB5757' : 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: 2,
                                borderColor: error && invalid ? '#EB5757' : '#1890FF',
                            },
                        },
                    }}
                    onChange={handleInputChange}
                />
                <Typography fontSize={14} fontWeight={700} position="absolute" right="12px" top="10px">
                    %
                </Typography>
            </Box>
            {error && invalid && (
                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                    {errorText}
                </Typography>
            )}
        </Stack>
    );
};

export default RoyaltyInput;
