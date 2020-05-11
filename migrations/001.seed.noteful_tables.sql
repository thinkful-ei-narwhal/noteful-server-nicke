TRUNCATE notes, folders RESTART IDENTITY CASCADE;
 
INSERT INTO folders (id, folder_name)
VALUES 
  (1, 'Important'),
  (2, 'Super'),
  (3, 'Spangley');

INSERT INTO notes (note_name, folderId, content)
VALUES 
('Dogs', 1, 'Corporis accusamus placeat quas non voluptas.'),
('Cats', 2, 'Eos laudantium quia ab blanditiis temporibus necessitatibus.'),
('testRef', 1, 'bic ol blah blah'),
('blep', 2, 'Blah blah'),
('Pigs', 3, 'Occaecati dignissimos quam qui facere deserunt quia. Quaerat aut eos laudantium');