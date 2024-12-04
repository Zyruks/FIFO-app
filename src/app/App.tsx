import Queue from '../components/Queue/Queue';
import { cn, useAuth } from '@common';
import { LoginForm } from '@components';
import { BaseLayout } from '@layouts';

const App = () => {
  const { currentUser, isLoading, isGuest } = useAuth();

  const classes = cn('flex items-center justify-center', 'bg-neutral-100 dark:bg-neutral-950');

  if (isLoading) {
    return (
      <div className={classes}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BaseLayout>
      <div className={classes}>{currentUser || isGuest ? <Queue /> : <LoginForm />}</div>
    </BaseLayout>
  );
};

export default App;
