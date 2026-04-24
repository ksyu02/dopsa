import axios from 'axios';

export default function addTaskForm() {
  const container = document.querySelector('.container');
  if (!container) return;
  if (container.querySelector('form')) return;

  const form = document.createElement('form');
  form.innerHTML = `
    <div class="mb-3">
      <label for="task" class="form-label">Задача</label>
      <input autocomplete="off" type="text" name="task" class="form-control" id="task" placeholder="Введите задачу">
    </div>
    <div class="mb-3">
      <label for="deadline" class="form-label">Крайний срок</label>
      <input autocomplete="off" type="text" name="deadline" class="form-control" id="deadline" placeholder="Введите дату и время">
    </div>
    <button type="submit" class="btn btn-primary" id="submit-btn">Добавить задачу</button>
  `;

  const heading = container.querySelector('h2');
  if (heading && heading.nextSibling) {
    container.insertBefore(form, heading.nextSibling);
  } else {
    container.appendChild(form);
  }

  const taskInput = form.querySelector('#task');
  const deadlineInput = form.querySelector('#deadline');
  const submitBtn = form.querySelector('#submit-btn');

  const isValidTask = (value) => /^[A-ZА-ЯЁ]/.test(value.trim());
  const isValidDeadline = (value) => /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/.test(value.trim());

  const updateInputValidation = () => {
    if (isValidTask(taskInput.value)) {
      taskInput.classList.add('input-valid');
      taskInput.classList.remove('input-invalid');
    } else {
      taskInput.classList.add('input-invalid');
      taskInput.classList.remove('input-valid');
    }

    if (isValidDeadline(deadlineInput.value)) {
      deadlineInput.classList.add('input-valid');
      deadlineInput.classList.remove('input-invalid');
    } else {
      deadlineInput.classList.add('input-invalid');
      deadlineInput.classList.remove('input-valid');
    }
  };

  const updateButtonAnimation = () => {
    const allValid = isValidTask(taskInput.value) && isValidDeadline(deadlineInput.value);
    if (allValid) {
      submitBtn.classList.add('bounce-animation');
    } else {
      submitBtn.classList.remove('bounce-animation');
    }
  };

  const updateUI = () => {
    updateInputValidation();
    updateButtonAnimation();
  };

  taskInput.addEventListener('input', updateUI);
  deadlineInput.addEventListener('input', updateUI);

  const showModal = () => {
    const modal = document.getElementById('successModal');
    const backdrop = document.getElementById('modalBackdrop');

    if (modal && backdrop) {
      modal.style.display = 'block';
      modal.classList.add('show');
      backdrop.style.display = 'block';

      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('show');
        backdrop.style.display = 'none';
      }, 3000);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    updateUI();

    const task = taskInput.value.trim();
    const deadline = deadlineInput.value.trim();

    if (isValidTask(task) && isValidDeadline(deadline)) {
      try {
        await axios.post('/tasks', { task, deadline });
        showModal();
      } catch (error) {
        console.error('Ошибка отправки', error);
      }
    }
  });
}