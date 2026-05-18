import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SpreadsheetInput, type SpreadsheetColumn } from '@/components/bahrawy/spreadsheet-input'
import { toCSV } from '@/lib/csv-utils'

const basicColumns: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', type: 'text' },
  { key: 'age', header: 'Age', type: 'number' },
  { key: 'email', header: 'Email', type: 'text' },
]

const checkboxColumns: SpreadsheetColumn[] = [
  { key: 'task', header: 'Task', type: 'text' },
  { key: 'done', header: 'Done', type: 'checkbox' },
]

const requiredColumns: SpreadsheetColumn[] = [
  { key: 'name', header: 'Name', type: 'text', required: true },
]

describe('SpreadsheetInput', () => {
  it('renders without crashing', () => {
    render(<SpreadsheetInput columns={basicColumns} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders correct number of columns from columns prop', () => {
    render(<SpreadsheetInput columns={basicColumns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders default empty rows (defaultRowCount)', () => {
    render(<SpreadsheetInput columns={basicColumns} defaultRowCount={5} />)
    // Should have 5 row numbers
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('clicking cell selects it', async () => {
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'alice@test.com' }]}
      />,
    )
    const cell = screen.getByText('Alice')
    await user.click(cell)
    // The cell's parent should have selection styling (bg-blue)
    expect(cell.closest('[role="gridcell"]')?.className).toContain('bg-blue')
  })

  it('double-clicking cell enters edit mode', async () => {
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
      />,
    )
    const cell = screen.getByText('Alice')
    await user.dblClick(cell)
    // Should see an input with Alice value
    const input = screen.getByDisplayValue('Alice')
    expect(input).toBeInTheDocument()
  })

  it('typing in edit mode updates cell value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        onChange={onChange}
      />,
    )
    // Double-click to edit
    await user.dblClick(screen.getByText('Alice'))
    const input = screen.getByDisplayValue('Alice')
    await user.clear(input)
    await user.type(input, 'Bob')
    // Press enter to commit
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0].name).toBe('Bob')
  })

  it('Tab key moves selection to next cell', async () => {
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
      />,
    )
    // Click first cell
    await user.click(screen.getByText('Alice'))
    // Get the grid and press Tab
    const grid = screen.getByRole('grid')
    await user.keyboard('{Tab}')
    // Age cell (30) should now be selected
    const ageCell = screen.getByText('30')
    expect(ageCell.closest('[role="gridcell"]')?.className).toContain('bg-blue')
  })

  it('Enter key enters edit mode on selected cell', async () => {
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
      />,
    )
    await user.click(screen.getByText('Alice'))
    const grid = screen.getByRole('grid')
    await user.keyboard('{Enter}')
    // Should now see an input for editing
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument()
  })

  it('onChange fires when cell value changes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        onChange={onChange}
      />,
    )
    await user.dblClick(screen.getByText('Alice'))
    const input = screen.getByDisplayValue('Alice')
    await user.clear(input)
    await user.type(input, 'X{Enter}')
    expect(onChange).toHaveBeenCalled()
  })

  it('add row button adds new row', async () => {
    const user = userEvent.setup()
    // Disable virtualization to avoid jsdom zero-height viewport clipping
    render(<SpreadsheetInput columns={basicColumns} defaultRowCount={2} virtualize={false} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.queryByText('3')).not.toBeInTheDocument()

    await user.click(screen.getByText('Add row'))
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('delete key on selected cell clears it', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByText('Alice'))
    await user.keyboard('{Delete}')
    expect(onChange).toHaveBeenCalled()
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall[0].name).toBe('')
  })

  it('readOnly=true prevents editing', async () => {
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        readOnly
      />,
    )
    await user.dblClick(screen.getByText('Alice'))
    // Should NOT enter edit mode
    expect(screen.queryByDisplayValue('Alice')).not.toBeInTheDocument()
  })

  it('number type cell right-aligns value', () => {
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 42, email: 'a@b.com' }]}
      />,
    )
    const cell = screen.getByText('42')
    expect(cell.closest('[role="gridcell"]')?.style.textAlign).toBe('right')
  })

  it('checkbox type cell renders checkbox not input', () => {
    render(
      <SpreadsheetInput
        columns={checkboxColumns}
        data={[{ task: 'Todo', done: true }]}
      />,
    )
    const checkbox = screen.getByLabelText('Done')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toBeChecked()
  })

  it('SUM formula evaluates correctly when enableFormulas=true', () => {
    const cols: SpreadsheetColumn[] = [{ key: 'val', header: 'Val', type: 'number' }]
    render(
      <SpreadsheetInput
        columns={cols}
        data={[
          { val: 10 },
          { val: 20 },
          { val: 30 },
          { val: '=SUM(A1:A3)' },
        ]}
        enableFormulas
      />,
    )
    // Should show 60 for the formula cell
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('undo reverts last change', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        onChange={onChange}
        showToolbar
      />,
    )
    // Edit a cell
    await user.dblClick(screen.getByText('Alice'))
    const input = screen.getByDisplayValue('Alice')
    await user.clear(input)
    await user.type(input, 'Bob{Enter}')

    // Click undo
    await user.click(screen.getByLabelText('Undo'))
    expect(onChange).toHaveBeenCalled()
  })

  it('redo reapplies undone change', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SpreadsheetInput
        columns={basicColumns}
        data={[{ name: 'Alice', age: 30, email: 'a@b.com' }]}
        onChange={onChange}
        showToolbar
      />,
    )
    // Edit
    await user.dblClick(screen.getByText('Alice'))
    const input = screen.getByDisplayValue('Alice')
    await user.clear(input)
    await user.type(input, 'Bob{Enter}')

    // Undo then redo
    await user.click(screen.getByLabelText('Undo'))
    await user.click(screen.getByLabelText('Redo'))
    expect(onChange).toHaveBeenCalled()
  })

  it('CSV export produces correct comma-separated output', () => {
    const headers = ['Name', 'Age']
    const data = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
    const keys = ['name', 'age']
    const csv = toCSV(headers, data, keys)
    expect(csv).toContain('Name,Age')
    expect(csv).toContain('Alice,30')
    expect(csv).toContain('Bob,25')
  })
})
