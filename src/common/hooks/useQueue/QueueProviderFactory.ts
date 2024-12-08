import { FirebaseQueueProvider } from './providers/FirebaseQueueProvider';
import { LocalStorageQueueProvider } from './providers/LocalStorageQueueProvider';
import { GUEST_QUEUE_KEY, QueueProvider, QueueProviderType } from '@common';

export class QueueProviderFactory {
  /**
   * Creates a QueueProvider instance based on the user's
   * authentication status.
   *
   * @param type - The type of the QueueProvider.
   * @param config - Configuration object for the provider.
   * @returns An instance of QueueProvider.
   */
  static createProvider(type: QueueProviderType, config?: { userId?: string }): QueueProvider {
    switch (type) {
      case QueueProviderType.FIREBASE:
        if (!config?.userId) throw new Error('Firebase provider requires userId');
        return new FirebaseQueueProvider(config.userId);

      case QueueProviderType.LOCAL_STORAGE:
        return new LocalStorageQueueProvider(GUEST_QUEUE_KEY);

      // Example of adding a new provider:
      // case QueueProviderType.AWS_S3:
      //   return new AwsS3QueueProvider(config);

      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}
