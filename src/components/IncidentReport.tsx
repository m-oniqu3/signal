import type { LatLng } from "leaflet";
import { useEffect, useState, type FormEvent } from "react";
import { CloseIcon } from "../icons";
import { type Address } from "../types/geo";
import { reverseGeocode } from "../utils/reverse-geocode";
import Button from "./Button";
import Modal from "./Modal";

type Props = {
  incidentLocation: LatLng;
  closeModal: () => void;
};

function IncidentReport(props: Props) {
  const { incidentLocation, closeModal } = props;
  const [report, setReport] = useState({
    title: "",
    content: "",
  });

  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    async function getAddress() {
      const { lat, lng } = incidentLocation;
      const data = await reverseGeocode(lat, lng);

      if (!data) return;

      setAddress(data);
    }

    if (incidentLocation) getAddress();
  }, [incidentLocation]);

  function handleReport(
    key: keyof typeof report,
    val: (typeof report)[keyof typeof report]
  ) {
    setReport((prevState) => {
      return {
        ...prevState,
        [key]: val,
      };
    });
  }

  function handleSubmitReport(e: FormEvent) {
    e.preventDefault();

    if (!report) return;
    console.log(report);
  }

  return (
    <Modal>
      <form className="panel flex flex-col gap-6" onSubmit={handleSubmitReport}>
        <header className="relative">
          <h1 className="text-xl font-medium">Report An Incident</h1>
          <p className="text-sm">Tell us about the incident.</p>

          <div className="text-sm mt-4">
            {address && (
              <>
                <p className="text-blue-300 text-base font-medium">
                  {address.name || (address.displayName && "Near")}
                </p>
                <p className="line-clamp-2 text-xs text-zinc-500">
                  {address.displayName}
                </p>
              </>
            )}
          </div>

          <button
            onClick={closeModal}
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
              minLength={10}
              placeholder="Fire on 5th avenue."
              value={report.title}
              onChange={(e) => handleReport("title", e.target.value)}
              className="input"
              name="title"
            />
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
              onChange={(e) => handleReport("content", e.target.value)}
              className="input h-20 resize-none no-scrollbar"
              placeholder="Fire on 5th Ave rn. Smoke is wild and emergency crews are here."
              name="content"
            ></textarea>
          </div>
        </div>

        <Button type="submit" className="h-9 bg-blue-300 text-white">
          Submit
        </Button>
      </form>
    </Modal>
  );
}

export default IncidentReport;
