import { CloseIcon } from "../../icons";
import type { Activity } from "../../types/activity";

type Props = {
  activity: Activity;
  closePopup: () => void;
};

function ActivityPopup(props: Props) {
  const { activity, closePopup } = props;

  return (
    <div className="flex flex-col gap-1 bg-white/90 rounded-xl p-4 shadow-md max-w-xs">
      <div onClick={closePopup}>
        <CloseIcon className="absolute top-2 right-2 size-5 text-zinc-500" />
      </div>

      <p className="text-orange-300 font-medium line-clamp-3">
        {activity.title}
      </p>
      <p className="text-sm text-zinc-500">
        at {activity.lat.toFixed(4)},{activity.lng.toFixed(4)}
      </p>
      {activity.content && (
        <p className="text-sm m-0 line-clamp-3">{activity.content}</p>
      )}
      <p className="text-xs text-zinc-500 mt-4 ml-auto">
        {new Date(activity.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default ActivityPopup;
