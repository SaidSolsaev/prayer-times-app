import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { registerForPushNotificationsAsync, schedulePrayerNotifications } from './notifications';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async (prayerTimes) => {
    try {
        if (prayerTimes) {
            await schedulePrayerNotifications(prayerTimes);
            return BackgroundFetch.Result.NewData;
        }

        return BackgroundFetch.Result.NoData;
    
    } catch (error) {
        console.error(error);
        return BackgroundFetch.Result.Failed;
    }
});

export async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60, // 1 hour in seconds
        stopOnTerminate: false,
        startOnBoot: true,
    });
}

export async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
