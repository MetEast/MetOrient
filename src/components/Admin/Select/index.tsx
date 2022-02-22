import React, { useState } from 'react';
import { SelectBtn, ListItemsWrapper, ListItemsStack, ItemButton } from './styles';
import { Box, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { TypeSelectItem } from 'src/types/select-types';

interface ComponentProps {
    options: Array<TypeSelectItem>;
    selected: number;
    handleClick: (value: string) => void;
}

const Select: React.FC<ComponentProps> = ({ options, selected, handleClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            onClick={() => {
                setIsOpen(!isOpen);
            }}
            position="relative"
        >
            <SelectBtn fullWidth isopen={isOpen ? 1 : 0}>
                {`${selected} art. / page`}
                <Icon icon="ph:caret-down" className="arrow-icon" />
            </SelectBtn>
            <ListItemsWrapper width={'100%'} isopen={isOpen ? 1 : 0}>
                <ListItemsStack>
                    {options.map((item, index) => (
                        <SelectItem
                            key={`sort-option-${index}`}
                            title={item.label}
                            value={item.value}
                            handleClick={handleClick}
                        />
                    ))}
                </ListItemsStack>
            </ListItemsWrapper>
        </Box>
    );
};

interface SelectItemProps {
    handleClick: (value: string) => void;
    title: string;
    value: string;
}

const SelectItem: React.FC<SelectItemProps> = ({ title, value, handleClick }) => {
    return (
        <ItemButton sx={{ fontSize: 14, fontWeight: 500 }} onClick={(e) => handleClick(value)}>
            {title}
        </ItemButton>
    );
};

export default Select;
