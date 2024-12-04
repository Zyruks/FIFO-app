import Queue from '../components/Queue/Queue';
import { cn, useAuth } from '@common';
import { LoginForm } from '@components';
import { BaseLayout } from '@layouts';

const App = () => {
  const { currentUser, isLoading, isGuest } = useAuth();

  const classes = cn(
    'flex h-full w-full items-center justify-center',
    'bg-neutral-100 dark:bg-neutral-950',
    'transition-colors duration-300 ease-in-out',
  );

  if (isLoading) {
    return (
      <div className={classes}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BaseLayout>
      <main className={classes}>
        <div className="container max-md:px-4">{currentUser || isGuest ? <Queue /> : <LoginForm />}</div>
      </main>
    </BaseLayout>
  );
};

export default App;
