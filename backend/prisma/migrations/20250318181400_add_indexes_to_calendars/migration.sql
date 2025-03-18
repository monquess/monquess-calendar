-- CreateIndex
CREATE INDEX "events_calendar_id_idx" ON "events"("calendar_id");

-- CreateIndex
CREATE INDEX "events_start_date_end_date_idx" ON "events"("start_date", "end_date");
