// event.controller.ts
import { Request, Response } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getSeatAvailability,
  bookSeats,
} from "../services/event_services";
import { createEventValidation, updateEventValidation } from "../validations/event_validations";


export const handleCreateEvent:any = async (req: Request, res: Response) => {
  try {
    const {error, value} = createEventValidation.validate(req.body);
    if(error){
     return res
       .status(400)
       .json({ message: "Invalid Input", error: error.details[0].message });
    }
    const event = await createEvent(value);
    res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetEvents:any = async (req: Request, res: Response) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetEventById:any = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateEvent:any = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const { error, value } = updateEventValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid Input", error: error.details[0].message });
    }
    const event = await updateEvent(id, value);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteEvent:any = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    await deleteEvent(id);
    res.status(204).json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetSeatAvailability: any = async (
  req: Request,
  res: Response
) => {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const seats = await getSeatAvailability(eventId);
    res.status(200).json(seats);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleBookSeats: any = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const { seats } = req.body;
    if (!eventId || !seats || !Array.isArray(seats)) {
      return res
        .status(400)
        .json({ message: "Event ID and seats are required" });
    }
    const bookingResult = await bookSeats(eventId, seats);
    if (!bookingResult) {
      return res.status(400).json({ message: "Booking failed" });
    }
    res
      .status(200)
      .json({ message: "Seats booked successfully", bookingResult });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};