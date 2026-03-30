import * as XLSX from 'xlsx';

export const parseExcelFile = async (file, expectedColumns = []) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('El archivo Excel está vacío.');
        }
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (json.length === 0) {
          throw new Error('No se encontraron datos en la primera hoja.');
        }

        // Validate columns if expectedColumns are provided
        if (expectedColumns.length > 0) {
          const actualColumns = Object.keys(json[0]);
          const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
          
          if (missingColumns.length > 0) {
            throw new Error(`Faltan las siguientes columnas requeridas: ${missingColumns.join(', ')}`);
          }
        }
        
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const validateData = (data, schema) => {
  const errors = [];
  const validData = [];

  data.forEach((row, index) => {
    const rowErrors = [];
    const validatedRow = { ...row };

    Object.keys(schema).forEach(key => {
      const rules = schema[key];
      const value = row[key];

      if (rules.required && (value === undefined || value === null || value === '')) {
        rowErrors.push(`La columna "${key}" es obligatoria.`);
      }

      if (rules.type === 'number' && value !== '') {
        const num = Number(value);
        if (isNaN(num)) {
          rowErrors.push(`La columna "${key}" debe ser un número válido.`);
        } else {
          validatedRow[key] = num;
        }
      }
    });

    if (rowErrors.length > 0) {
      errors.push({ row: index + 2, messages: rowErrors }); // +2 for 1-based index and header row
    } else {
      validData.push(validatedRow);
    }
  });

  return { validData, errors, isValid: errors.length === 0 };
};

export const generatePreview = (data, maxRows = 5) => {
  return data.slice(0, maxRows);
};