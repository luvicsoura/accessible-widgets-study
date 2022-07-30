import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NavigationKeys } from '../../enums/NavigationKeys';

export type ListboxProps = {
	options: string[];
};

export const Listbox: React.FC<ListboxProps> = ({ options }) => {
	
	const listboxRef = useRef<HTMLUListElement>(null);
	const [ currentItem, setCurrentItem ] = useState<number>(-1);
	const [ currentItemId, setCurrentItemId ] = useState<string>();
	const [ optionItems, setOptionItems ] = useState<HTMLLIElement[]>([]);

	const idPrefix = useMemo(() => 'listbox-'.concat(Date.now().toString()), []);
	const labelId = idPrefix.concat('-label');

	useEffect(() => {
		if (!listboxRef.current) return;
		setupOptions();
	}, [listboxRef.current]);

	const setupOptions = () => {
		const nativeEl = getCurrentNativeElement();
		setOptionItems(Array.from(nativeEl.querySelectorAll('[role="option"]')));
	}

	const getCurrentNativeElement = () => {
		if (!listboxRef.current) throw new Error('Listbox ref not yet initialized');
		return listboxRef.current;
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
		switch (e.key) {
			case NavigationKeys.Home:
				setActiveOption(0);
				break;
			case NavigationKeys.KeyUp:
				setActiveOption(getPreviousOptionIndex());
				break;
			case NavigationKeys.KeyDown:
				setActiveOption(getNextOptionIndex());
				break;
			case NavigationKeys.End:
				setActiveOption(optionItems.length - 1);
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

	const setActiveOption = (index: number) => {
		setCurrentItemId(optionItems[index].id);
		setCurrentItem(index);
	};

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
					<li
						role='option'
						id={idPrefix.concat(':').concat(index.toString())}
						key={option}
					>
						{option}
					</li>
				))}
			</ul>
		</div>
	);
}