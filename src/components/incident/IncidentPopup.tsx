import { useAuth } from "../../context/useAuth";
import {
  CloseIcon,
  CommentIcon,
  EllipsisVerticalIcon,
  LoadingIcon,
  ThumbsUpIcon,
  ViewIcon,
} from "../../icons";
import type { Incident } from "../../types/incident";
import type { PopupPosition } from "../../types/popup";
import { formatTime, timeAgo } from "../../utils/format-time";

type Props = {
  incident: Incident | null;
  isLoading: boolean;
  closePopup: () => void;
  position: PopupPosition;
};

function IncidentPopup(props: Props) {
  const {
    incident,
    isLoading,
    position: { x, y },
    closePopup,
  } = props;

  const { user } = useAuth();
  if (!incident) return;

  const {
    title,
    content,
    lat,
    lng,
    address_name,
    address_display,
    user_id,
    created_at,
  } = incident;

  const isIncidentCreator = user_id === user?.id;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed w-85 min-h-32 rounded-2xl bg-white/95 border border-gray-200 shadow-2xl"
      style={{ left: x, top: y - 25, transform: "translate(-50%, -100%)" }}
    >
      {isLoading && (
        <div className="min-h-32 grid place-items-center">
          <LoadingIcon className="icon" />
        </div>
      )}

      {!isLoading && incident && (
        <>
          <div className=" flex flex-col gap-1 p-5">
            <div onClick={closePopup} className="absolute top-3.5 right-3">
              <CloseIcon className="icon" />
            </div>

            <p className="leading-5 font-[450] text-neutral-600 line-clamp-4 w-9/12">
              {title}
            </p>

            <p className="text-xs text-zinc-500 pt-1">
              at{" "}
              {address_name
                ? address_name
                : address_display
                ? `${address_display}`
                : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              {/* &nbsp; &nbsp;
              {(address_name || address_display || lat) && <span>&#xb7;</span>}
              &nbsp; &nbsp;
              <span className="text-nowrap"> {formatTime(created_at)}</span>
              &nbsp; &nbsp;
              <span>&#xb7;</span>
              &nbsp; &nbsp;
              <span className="text-nowrap"> {timeAgo(created_at)}</span> */}
            </p>

            <p className="text-xs text-zinc-500 flex items-center gap-1 pt-1">
              around {formatTime(created_at)}
              <span>&#xb7;</span>
              {timeAgo(created_at)}
            </p>

            {content && (
              <p className="text-[13px] pt-3 leading-4.5 font-[370] text-zinc-500 line-clamp-3">
                {content}
              </p>
            )}

            {/* <p className="text-xs text-zinc-500 flex items-center gap-1 pt-2">
              {formatTime(created_at)}
              <span>&#xb7;</span>
              {timeAgo(created_at)}
            </p> */}
          </div>

          <div className="flex justify-between items-center p-5 pb-8 h-14">
            <div className="icon-group">
              <ViewIcon className="icon" />
              <p className="icon-text">3.1k</p>
            </div>

            <div className="icon-group">
              <ThumbsUpIcon className="icon" />
              <p className="icon-text">2.8k</p>
            </div>

            <div className="icon-group">
              <CommentIcon className="icon" />
              <p className="icon-text">506</p>
            </div>

            <EllipsisVerticalIcon className="icon" />
          </div>
        </>
      )}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-t-10 border-t-white/95" />
    </div>
  );
}

export default IncidentPopup;
