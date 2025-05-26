const squaresPerPage = 12; // 3x3 grid
const generateBtn = document.getElementById('generate-btn');
const exportBtn = document.getElementById('export-btn');

generateBtn.addEventListener('click', generateSquares);
exportBtn.addEventListener('click', exportToPDF);

function generateSquares() {
    const textInputs = Array.from(document.getElementsByClassName('text-input'));
    const fontSizeInputs = Array.from(document.getElementsByClassName('font-size-input'));
    const globalSize = document.getElementById('font-size').value;
    const output = document.getElementById('output');
    
    output.innerHTML = '';
    
    let currentPage = createNewPage();
    let squareCount = 0;

    textInputs.forEach((input, index) => {
        if(squareCount >= squaresPerPage) {
            currentPage = createNewPage();
            squareCount = 0;
        }
        
        const text = input.value || `Etiqueta ${index + 1}`;
        const fontSize = fontSizeInputs[index].value || globalSize;
        
        const square = document.createElement('div');
        square.className = 'square';
        square.style.fontSize = `${fontSize}px`;
        square.innerHTML = text;
        
        currentPage.querySelector('.square-container').appendChild(square);
        squareCount++;
    });
}

function createTextInputs() {
    const container = document.getElementById('text-inputs-container');
    const quantity = parseInt(document.getElementById('quantity').value);
    const globalSize = document.getElementById('font-size').value;
    
    container.innerHTML = '';
    
    for(let i = 1; i <= quantity; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'text-input-group';
        
        // Input de texto
        const textGroup = document.createElement('div');
        textGroup.className = 'text-input-item';
        const textLabel = document.createElement('label');
        textLabel.innerHTML = `<i class="fas fa-tag icon"></i>Etiqueta ${i}:`;
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'text-input';
        textInput.placeholder = `Texto ${i}`;
        
        // Input de tamaño de fuente
        const sizeGroup = document.createElement('div');
        sizeGroup.className = 'font-size-item';
        const sizeLabel = document.createElement('label');
        sizeLabel.innerHTML = `<i class="fas fa-text-height icon"></i>Tamaño:`;
        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.className = 'font-size-input';
        sizeInput.placeholder = globalSize;
        sizeInput.min = '8';
        sizeInput.max = '72';
        sizeInput.value = globalSize;
        
        textGroup.appendChild(textLabel);
        textGroup.appendChild(textInput);
        sizeGroup.appendChild(sizeLabel);
        sizeGroup.appendChild(sizeInput);
        inputGroup.appendChild(textGroup);
        inputGroup.appendChild(sizeGroup);
        container.appendChild(inputGroup);
    }
     setTimeout(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// Llamar a createTextInputs al cargar la página para inicializar
document.addEventListener('DOMContentLoaded', createTextInputs);

function createNewPage() {
    const page = document.createElement('div');
    page.className = 'a4-page';
    const container = document.createElement('div');
    container.className = 'square-container';
    page.appendChild(container);
    document.getElementById('output').appendChild(page);
    return page;
}

async function exportToPDF() {
    const pages = document.querySelectorAll('.a4-page');
    const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    for(let i = 0; i < pages.length; i++) {
        if(i > 0) pdf.addPage();
        
        await html2canvas(pages[i]).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        });
    }

    pdf.save(`etiquetas_${Date.now()}.pdf`);
}
// Agrega al principio con las otras constantes
const printBtn = document.getElementById('print-btn');

// Agrega el event listener
printBtn.addEventListener('click', () => {
    window.print();
});