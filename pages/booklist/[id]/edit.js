// pages/booklist/[id]/edit.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Layout from "../../../components/Layout";
import booklistDataMock from "../../../data/booklistDataMock";
import AddBook from "../../../components/AddBook";

const EditBooklistPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const booklist = booklistDataMock.find(
    (item) => item.id === parseInt(id, 10),
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (booklist) {
      setTitle(booklist.title);
      setDescription(booklist.description);
      setBooks(booklist.books);
    }
  }, [booklist]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      `Updating booklist id ${id} with new title: ${title}, description: ${description}, and books: ${JSON.stringify(books)}`,
    );
    router.push(`/booklist/${id}`);
  };

  const handleCancel = () => {
    router.push(`/booklist/${id}`);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(books);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBooks(items);
  };

  const handleAddBook = (book) => {
    setBooks([...books, book]);
  };

  if (!booklist) {
    return (
      <Layout>
        <h2 className="text-2xl font-bold mb-4">Booklist not found</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-8 py-4 text-white bg-secondary">
        <h2 className="text-3xl font-bold mb-4">Edit Booklist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-xl font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-xl font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 p-2 block w-full bg-tertiary text-white border border-gray-600 rounded-md shadow-sm"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4">Books in this Booklist</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="books">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 mb-8"
                >
                  {books.map((book, index) => (
                    <Draggable
                      key={`book-${index}`}
                      draggableId={`book-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-tertiary p-4 rounded-lg"
                        >
                          <h4 className="text-2xl font-bold mb-2">
                            {book.Name}
                          </h4>
                          <p className="text-lg mb-2">{book.Author}</p>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <h3 className="text-2xl font-bold mb-4">Add Book to Booklist</h3>
          <AddBook onAddBook={handleAddBook} />
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition ease-in-out duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition ease-in-out duration-150"
            >
              Update Booklist
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditBooklistPage;
