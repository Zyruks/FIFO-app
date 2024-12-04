import { useEffect, useState } from 'react';
import { cn, FormFieldState, RegexPatterns, useQueue, validatePattern } from '@common';
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconCatalog,
  IconStyle,
  Notification,
  NotificationVariant,
  TextInput,
} from '@components';

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

export const QueueManager = ({ className }: QueueProps) => {
  const { queue, setQueue, isLoading } = useQueue();

  const [itemName, setItemName] = useState('');
  const [itemFieldState, setItemFieldState] = useState<FormFieldState>(FormFieldState.default);

  const [lastAttended, setLastAttended] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const classes = {
    container: cn(
      'mx-auto',
      'w-full space-y-6 rounded-lg p-12 shadow-md',
      'bg-neutral-50 shadow-lg dark:bg-neutral-950',
      'border border-neutral-300 dark:border-neutral-700',
      'text-neutral-950 dark:text-neutral-50',
      'dark:shadow-neutral-800/40',
      'animate-fade-up animate-duration-300',
      className,
    ),
  };

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim()) {
      setItemFieldState(FormFieldState.error);
      return;
    }

    if (queue.some((item) => item.name.toLowerCase() === itemName.trim().toLowerCase())) {
      setNotification(`"${itemName.trim()}" is a duplicate and cannot be added.`);
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
    setLastAttended(attendedItem.name);
    setQueue(rest);
  };

  const handleRemoveItem = (id: string) => {
    const removedItem = queue.find((item) => item.id === id);
    if (removedItem) setLastRemoved(removedItem.name);
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
      <p className="max-h-64 min-h-64 text-gray-500">No items in the queue.</p>
    ) : (
      <ul className="max-h-64 min-h-64 space-y-4 overflow-auto py-4 pr-4">
        {queue.map((item) => (
          <li key={item.id} className="flex animate-fade-up items-center justify-between">
            <span className="font-semibold">{item.name}</span>
            <Button size={ButtonSize.sm} onClick={() => handleRemoveItem(item.id)} variant={ButtonVariant.destructive}>
              <Icon icon={IconCatalog.trashCan} className="size-4" iconStyle={IconStyle.bold} />
            </Button>
          </li>
        ))}
      </ul>
    );

  const renderNotifications = () => (
    <div className="space-y-4">
      {lastAttended && (
        <Notification variant={NotificationVariant.success} message={`Last Attended: ${lastAttended}`} />
      )}
      {lastRemoved && <Notification variant={NotificationVariant.warning} message={`Last Removed: ${lastRemoved}`} />}
      {notification && (
        <Notification
          className="animate-shake animate-duration-200"
          variant={NotificationVariant.error}
          message={notification}
        />
      )}
    </div>
  );

  if (isLoading) {
    return (
      <section className={classes.container}>
        <header>
          <h1 className="text-center text-2xl font-bold">FIFO Management</h1>
        </header>
        <div className="py-20 text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={classes.container}>
      <header>
        <h1 className="text-center text-2xl font-bold">FIFO Management</h1>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Add Items Form */}
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

          {renderNotifications()}
        </form>

        {/* Queue Section */}
        <section className="grid gap-4">
          <div className="space-y-0.5">
            <h2 className="border-b border-neutral-300 pb-2 text-xl font-semibold dark:border-neutral-700">
              Current Queue
            </h2>
            {renderQueueItems()}
          </div>

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
    </section>
  );
};
