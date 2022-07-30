import { KeyboardEvent, MouseEventHandler, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { NavigationKeys } from '../../enums/NavigationKeys';

export type ListboxProps = {
	options: string[];
	onSelect?: (value: string) => void,
};

class ListboxOption<T extends HTMLElement = HTMLLIElement> {

	constructor(private nativeElement: T) {}

	get id() {
		return this.nativeElement.id;
	}

	getNativeElement() {
		return this.nativeElement;
	}
}

export const Listbox: React.FC<ListboxProps> = ({ options, onSelect }) => {
	
	const listboxRef = useRef<HTMLUListElement>(null);
	const [ currentItem, setCurrentItem ] = useState<number>(-1);
	const [ selectedItem, setSelectedItem ] = useState<number>(-1);
	const [ currentItemId, setCurrentItemId ] = useState<string>();
	const [ optionItems, setOptionItems ] = useState<ListboxOption[]>([]);

	const idPrefix = useMemo(() => 'listbox-'.concat(Date.now().toString()), []);
	const labelId = idPrefix.concat('-label');

	useEffect(() => {
		if (!listboxRef.current) return;
		setupOptions();
	}, [listboxRef.current]);

	const setupOptions = () => {
		const nativeEl = getCurrentNativeElement();
		setOptionItems(
			Array
				.from(nativeEl.querySelectorAll<HTMLLIElement>('[role="option"]'))
				.map((el) => new ListboxOption<HTMLLIElement>(el))
		);
	}

	const getCurrentNativeElement = () => {
		if (!listboxRef.current) throw new Error('Listbox ref not yet initialized');
		return listboxRef.current;
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
		switch (e.key) {
			case NavigationKeys.Home:
				setFocusedOption(0);
				break;
			case NavigationKeys.KeyUp:
				setFocusedOption(getPreviousOptionIndex());
				break;
			case NavigationKeys.KeyDown:
				setFocusedOption(getNextOptionIndex());
				break;
			case NavigationKeys.End:
				setFocusedOption(optionItems.length - 1);
				break;

			case 'Enter':
				commitSelection();
				break;
		}
	}

	const getPreviousOptionIndex = () => {
		if (currentItem <= 0) return optionItems.length - 1;
		return currentItem - 1;
	};

	const getNextOptionIndex = () => {
		if (currentItem >= optionItems.length -1) return 0;
		return currentItem + 1;
	};

	const setFocusedOption = (index: number) => {
		setCurrentItemId(optionItems[index].id);
		setCurrentItem(index);
	};

	const commitSelection = () => {
		if (onSelect) onSelect(options[currentItem]);
		setSelectedItem(currentItem);
	}

	return (
		<div>
			<label id={labelId}>Example listbox</label>
			<ul
				id={idPrefix}
				ref={listboxRef}
				tabIndex={0}
				role='listbox'
				onKeyDown={handleKeyDown}
				aria-labelledby={labelId}
				aria-activedescendant={currentItemId}
			>
				{options.map((option, index) => (
					<Option
						id={idPrefix.concat(':').concat(index.toString())}
						focused={currentItem === index}
						selected={selectedItem === index}
						onMouseOver={() => setFocusedOption(index)}
						onClick={() => commitSelection()}
						key={option}
					>
						{option}
					</Option>
				))}
			</ul>
		</div>
	);
};

const Option: React.FC<PropsWithChildren & {
	id: string,
	onMouseOver?: MouseEventHandler<HTMLLIElement>,
	onClick?: MouseEventHandler<HTMLLIElement>,
	focused?: boolean,
	selected?: boolean,
}> = ({ children, ...props }) => (
	<Li
		role='option'
		aria-selected={Boolean(props.selected)}
		{...props}
	>
		{children}
	</Li>
);


const Li = styled('li')(
	{
		'&:hover': {
			backgroundColor: '#e1e1e1',
		}
	},
	({ focused, selected }: { focused?: boolean, selected?: boolean}) => ({
		outline: focused ? '2px solid blue' : 0,
		backgroundColor: focused ? '#e1e1e1' : undefined,
		border: selected ? '5px dashed green' : undefined,
	})
)