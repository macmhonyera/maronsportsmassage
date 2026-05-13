-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "addOns" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "focusAreas" TEXT[] DEFAULT ARRAY[]::TEXT[];
