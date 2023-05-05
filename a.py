entry_id = 1  # ID of the entry to be deleted

with open('project_log.txt', 'r') as file:
    lines = file.readlines()

found_entry = False

with open('project_log.txt', 'w') as file:
    for line in lines:
        if line.startswith('ID:'):
            current_entry_id = int(line.split('-')[0].split(':')[1].strip())
            if current_entry_id == entry_id:
                found_entry = True
                continue  # Skip writing the line for the entry to be deleted
            file.write(line)

if found_entry:
    print("Entry deleted successfully.")
else:
    print("Entry with ID {} not found.".format(entry_id))
