import { useState } from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import { Box, Button, FormControl, FormLabel, Input, VStack, HStack, Text } from '@chakra-ui/react';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    addEvent.mutate(newEvent);
    setNewEvent({ name: '', date: '', venue: '' });
  };

  const handleUpdateEvent = () => {
    updateEvent.mutate(editingEvent);
    setEditingEvent(null);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
  };

  const handleDeleteClick = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading events</div>;

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={newEvent.name} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={newEvent.date} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Venue</FormLabel>
          <Input name="venue" value={newEvent.venue} onChange={handleChange} />
        </FormControl>
        <Button onClick={handleAddEvent}>Add Event</Button>
      </VStack>

      <VStack spacing={4} mt={8}>
        {events.map((event) => (
          <Box key={event.id} p={4} borderWidth={1} borderRadius="md" w="100%">
            {editingEvent && editingEvent.id === event.id ? (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input name="name" value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                </FormControl>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" name="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </FormControl>
                <FormControl>
                  <FormLabel>Venue</FormLabel>
                  <Input name="venue" value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} />
                </FormControl>
                <HStack spacing={4}>
                  <Button onClick={handleUpdateEvent}>Update</Button>
                  <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
                </HStack>
              </VStack>
            ) : (
              <HStack spacing={4} justify="space-between">
                <Text>{event.name}</Text>
                <Text>{event.date}</Text>
                <Text>{event.venue}</Text>
                <HStack spacing={4}>
                  <Button onClick={() => handleEditClick(event)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(event.id)}>Delete</Button>
                </HStack>
              </HStack>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Events;