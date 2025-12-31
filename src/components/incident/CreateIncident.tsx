import { zodResolver } from "@hookform/resolvers/zod";

import type { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/useAuth";
import { CloseIcon, LoadingIcon } from "../../icons";
import { createIncident } from "../../services/incidents/create-incident";
import type { Incident } from "../../types/incident";
import { reverseGeocode } from "../../utils/reverse-geocode";

import type { Address } from "../../types/geo";
import {
  incidentSchema,
  type IncidentFormData,
} from "../../utils/validation/incident";
import Button from "../Button";
import Modal from "../Modal";

type Props = {
  incidentLocation: LatLng;
  addMarker: (incident: Incident) => void;

  onClose: () => void;
};

function CreateIncident(props: Props) {
  const { incidentLocation, addMarker, onClose } = props;
  const [address, setAddress] = useState<Address | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
  });

  useEffect(() => {
    async function getAddress() {
      setIsSearching(true);
      const { lat, lng } = incidentLocation;
      const data = await reverseGeocode(lat, lng);

      if (!data) return;

      setAddress(data);
      setIsSearching(false);
    }

    if (incidentLocation) getAddress();
  }, [incidentLocation]);

  async function handleSubmitReport(formData: IncidentFormData) {
    console.log(formData);
    if (!user) return;

    const { lat, lng } = incidentLocation;

    try {
      const incident = await createIncident(
        formData.title,
        formData.content ?? "",
        lat,
        lng,
        user.id,
        address ?? null
      );

      console.log("add marker", incident);
      addMarker(incident);

      reset();
      onClose();
    } catch (err) {
      console.error(err);

      // todo : show error somewhere on the form
      setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <Modal closeModal={onClose}>
      <form
        className="panel flex flex-col gap-6"
        onSubmit={handleSubmit(handleSubmitReport)}
      >
        <header className="relative">
          <h1 className="text-xl font-medium">What's happening?</h1>
          <p className="text-sm">Tell us what's going on.</p>

          <div className="text-sm mt-4 max-w-xs">
            {isSearching && (
              <p className="text-sm text-zinc-500">Searching for address...</p>
            )}
            {!isSearching && address && (
              <>
                <p className="text-blue-300 text-base font-medium">
                  {address.name || (address.displayName && "Near")}
                </p>
                <p className="line-clamp-2 text-xs text-zinc-500 w-full">
                  {address.displayName}
                </p>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-0 right-0 cursor-pointer"
          >
            <CloseIcon className="size-6" />
          </button>
        </header>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <p className="text-sm text-neutral-500">Sumarize the event.</p>
            </div>

            <input
              type="text"
              {...register("title")}
              placeholder="Fire on 5th avenue."
              className="input"
            />
            {errors.title && (
              <p className="input-error">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="content" className="text-sm font-medium">
                Description
              </label>
              <p className="text-sm text-neutral-500">
                Describe the incident in as much detail as possible.
              </p>
            </div>

            <textarea
              {...register("content")}
              className="input h-20 resize-none no-scrollbar"
              placeholder="Fire on 5th Ave rn. Smoke is wild and emergency crews are here."
            ></textarea>
            {errors.content && (
              <p className="input-error">{errors.content.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 bg-blue-300 text-white"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-1">
              <span>Submitting</span>
              <span>
                <LoadingIcon className="animate-spin size-4" />
              </span>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Modal>
  );
}

export default CreateIncident;
