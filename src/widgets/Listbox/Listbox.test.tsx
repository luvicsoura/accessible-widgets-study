import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { PropsWithChildren } from 'react';
import { Listbox } from './Listbox';

const options = ['Option 1', 'Option 2', 'Option 3'];

describe('Listbox', () => {
	it('Given an array of strings as options, they should be rendered', () => {
		render(<Listbox options={options}/>);

		options.forEach((option) => {
			expect(screen.getByText(option)).toBeInTheDocument();
		});
	});

	it('Should have no accessibility violations that can be perceived via an automated tool', async () => {
		const { container } = render(<Listbox options={options}/>);
		const results = await axe(container);
		
		expect(results).toHaveNoViolations();
	});

	it('Should be reachable by tab-navigation', () => {
		const wrapper: React.FC<PropsWithChildren> = ({children}) => (
			<div>
				<button>Initially focused element</button>
				{children}
			</div>
		)
		render(<Listbox options={options}/>, { wrapper });
		screen.getByRole('button').focus();
		//eslint-disable-next-line testing-library/no-node-access
		expect(document.activeElement).toBe(screen.getByRole('button'));

		userEvent.tab();

		expect(screen.getByRole('listbox')).toHaveFocus();
	});

	it('Should not have an active descendent by default', () => {
		render(<Listbox options={options}/>);
		expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-activedescendant');
	});

	it('All the option elements should have the id attribute', () => {
		render(<Listbox options={options}/>);

		options.forEach((option) => {
			expect(screen.getByRole('option', { name: option })).toHaveAttribute('id');
		});
	});

	describe('Keyboard Navigation', () => {
		it("Should focus the first item, when pressing 'Home'", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();

			userEvent.keyboard('{Home}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 1'}).id
			);
		});

		it("Should focus the lat item, when pressing 'End'", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();

			userEvent.keyboard('{End}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 3'}).id
			);
		});

		it("Given no item was focused, pressing 'ArrowDown' should focus the first item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();

			userEvent.keyboard('{ArrowDown}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 1'}).id
			);
		});

		it("Given the first item was focused, pressing 'ArrowDown' should focus the second item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();
			userEvent.keyboard('{ArrowDown}');

			userEvent.keyboard('{ArrowDown}');


			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 2'}).id
			);
		});

		it("Given the last item was focused, pressing 'ArrowDown' should focus the first item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();
			userEvent.keyboard('{ArrowDown}');
			userEvent.keyboard('{ArrowDown}');
			userEvent.keyboard('{ArrowDown}');

			userEvent.keyboard('{ArrowDown}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 1'}).id
			);
		});

		it("Given no item was focused, pressing 'ArrowUp' should focus the last item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();

			userEvent.keyboard('{ArrowUp}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 3'}).id
			);
		});

		it("Given the last item was focused, pressing 'ArrowUp' should focus the second-last item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();
			userEvent.keyboard('{ArrowUp}');

			userEvent.keyboard('{ArrowUp}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 2'}).id
			);
		});

		it("Given the second item was focused, pressing 'ArrowUp' should focus the first item", () => {
			const options = ['Option 1', 'Option 2', 'Option 3'];
			render(<Listbox options={options}/>);
			userEvent.tab();
			userEvent.keyboard('{ArrowUp}');
			userEvent.keyboard('{ArrowUp}');

			userEvent.keyboard('{ArrowUp}');

			expect(screen.getByRole('listbox')).toHaveAttribute(
				'aria-activedescendant', 
				screen.getByRole('option', {name: 'Option 1'}).id
			);
		});
	});
});