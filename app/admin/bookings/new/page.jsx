import BookingForm from "../BookingForm";

export const metadata = { title: "Add Booking | Admin" };

export default function AdminNewBooking() {
  return <BookingForm mode="create" />;
}
