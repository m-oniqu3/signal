import type { Activity } from "../../types/incident";

type Props = {
  activity: Activity;
};

function ActivityPopup(props: Props) {
  const { activity } = props;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* <div onClick={closePopup}>
        <CloseIcon className="absolute top-2 right-2 size-5 text-zinc-500" />
      </div> */}

      <p
        className="text-orange-300 text-lg m-0 leading-tight font-medium line-clamp-3"
        style={{ margin: 0 }}
      >
        {activity.title}
      </p>
      <p className="text-sm text-zinc-500 " style={{ margin: 0 }}>
        at {activity.lat.toFixed(4)},{activity.lng.toFixed(4)}
      </p>
      {activity.content && (
        <p className="text-sm  line-clamp-3" style={{ margin: 0 }}>
          {activity.content}
        </p>
      )}
      <p className="text-xs text-zinc-500 mt-4 ml-auto" style={{ margin: 0 }}>
        {new Date(activity.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default ActivityPopup;
