-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "therapistPreference" TEXT;

-- CreateIndex
CREATE INDEX "Booking_therapistPreference_idx" ON "Booking"("therapistPreference");
