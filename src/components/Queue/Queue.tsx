import { useState } from 'react';
import { cn, FormFieldState, RegexPatterns, useQueueContext, validatePattern } from '@common';
import { Button, ButtonSize, ButtonVariant, TextInput } from '@components';

type QueueItem = {
  id: string;
  name: string;
};

interface QueueProps {
  /**
   * Additional classes for Queue.
   */
  className?: string;
}

const Queue = ({ className }: QueueProps) => {
  const { queue, setQueue } = useQueueContext();

  const [itemName, setItemName] = useState('');
  const [itemFieldState, setItemFieldState] = useState<FormFieldState>(FormFieldState.default);

  const classes = {
    container: cn(
      'container mx-auto w-full space-y-6 rounded-lg p-12 shadow-md',
      'bg-neutral-50 shadow-lg dark:bg-neutral-900',
      'border border-neutral-300 dark:border-neutral-700',
      'text-neutral-950 dark:text-neutral-50',
      'dark:shadow-neutral-800/50',
      'animate-fade-up animate-duration-100',
      className,
    ),
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      setItemFieldState(FormFieldState.error);
      return;
    }

    if (queue.some((item) => item.name.toLowerCase() === itemName.trim().toLowerCase())) {
      alert('Item already exists.');
      return;
    }

    const newItem: QueueItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
    };

    setQueue([...queue, newItem]);
    setItemName('');
    setItemFieldState(FormFieldState.default);
  };

  const handleAttendNext = () => {
    if (queue.length === 0) return;

    const [attendedItem, ...rest] = queue;
    alert(`Attended to: ${attendedItem.name}`);
    setQueue(rest);
  };

  const handleRemoveItem = (id: string) => {
    setQueue(queue.filter((item) => item.id !== id));
  };

  const handleOnBlur = () => {
    if (!validatePattern(itemName, RegexPatterns.noEmpty)) {
      setItemFieldState(FormFieldState.error);
    } else {
      setItemFieldState(FormFieldState.success);
    }
  };

  const renderQueueItems = () =>
    queue.length === 0 ? (
      <p className="text-gray-500">No items in the queue.</p>
    ) : (
      <ul className="max-h-64 min-h-64 list-inside list-disc space-y-4 overflow-scroll py-4 pr-4">
        {queue.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span className="font-semibold">{item.name}</span>
            <Button size={ButtonSize.sm} onClick={() => handleRemoveItem(item.id)} variant={ButtonVariant.destructive}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    );

  return (
    <main className={classes.container}>
      <header>
        <h1 className="text-center text-2xl font-bold">FIFO Management</h1>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {/*  Queue Add Items  */}
        <form onSubmit={handleAddItem} className="space-y-4">
          <TextInput
            label="Add to Queue"
            id="queue-input"
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              setItemFieldState(FormFieldState.default);
            }}
            onBlur={handleOnBlur}
            isRequired
            assistiveText={itemFieldState === FormFieldState.error ? 'Item name cannot be empty.' : ''}
            fieldState={itemFieldState}
          />

          <Button isFullWidth type="submit" variant={ButtonVariant.primary} isDisabled={!itemName.trim()}>
            Add Item
          </Button>
        </form>

        <section className="grid gap-4">
          {/* Queue List */}
          <div className="space-y-0.5">
            <h2 className="border-b border-neutral-300 pb-2 text-xl font-semibold dark:border-neutral-700">
              Current Queue
            </h2>
            {renderQueueItems()}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant={ButtonVariant.secondary}
              onClick={handleAttendNext}
              disabled={queue.length === 0}
            >
              Attend
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Queue;
