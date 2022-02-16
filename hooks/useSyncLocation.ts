import { useEffect } from "react";
import UnauthorizedError from "../errors/UnauthorizedError";
import { updatePosition } from "../services/api";
import { getLatLng, throwErrorIfErrorStatusCode } from "../utils";

export default function useSyncLocation(token: string) {
  useEffect(() => {
    if (!token) return;

    let timeout: any;

    const scheduleTimeout = () => {
      timeout = setTimeout(() => {
        sendLocation();
      }, 60 * 1000);
    };

    const sendLocation = async () => {
      const location = await getLatLng();

      if (location) {
        try {
          await updatePosition(location.lat, location.lon, token).then(throwErrorIfErrorStatusCode);
        } catch (e) {
          if (e instanceof UnauthorizedError) {
            clearTimeout(timeout);

            return;
          }

          console.error(e);
        }

        scheduleTimeout();
      } else {
        scheduleTimeout();
      }
    };

    // sendLocation();

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [token]);
}
