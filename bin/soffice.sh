#!/bin/bash
shopt -s extglob dotglob
# Function to display usage
usage() {
    echo "Usage: $0 <input_file> [output_dir]"
    echo "Supported input formats: .html, .htm, .docx, .doc, .odt, .xlsx, .xls, .pptx, .ppt"
    echo "Output format is determined by output_dir or uses current directory"
    exit 1
}

# Function to get the appropriate filter based on file extension
get_filter() {
    local ext="$1"
    local output_format="$2"
    
    case "$ext" in
        # HTML files (to DOCX)
        html|htm)
            if [ "$output_format" = "docx" ]; then
                echo "docx:MS Word 2007 XML:EmbedImages"
            else
                echo "writer_pdf_Export"
            fi
            ;;
        
        # Word documents (to PDF)
        docx)
            echo "writer_pdf_Export"
            ;;
        
        .doc)
            echo "writer_pdf_Export"
            ;;
        
        # OpenDocument Text (to PDF)
        odt)
            echo "writer_pdf_Export"
            ;;
        
        # Excel/Spreadsheets (to PDF)
        xlsx|xls)
            echo "calc_pdf_Export"
            ;;
        
        # PowerPoint/Presentations (to PDF)
        pptx|ppt)
            echo "impress_pdf_Export"
            ;;
        
        # Images/Drawings (to PDF)
        odg)
            echo "draw_pdf_Export"
            ;;
        
        *)
            echo "ERROR: Unsupported file extension: $ext" >&2
            return 1
            ;;
    esac
}

# Function to determine output filename
get_output_filename() {
    local input_file="$1"
    local output_dir="$2"
    local output_format="$3"
    
    local basename=$(basename "$input_file")
    local name_without_ext="${basename%.*}"
    local output_file="${output_dir}/${name_without_ext}.${output_format}"
    
    echo "$output_file"
}

# Main script
main() {
    # Check arguments
    if [ $# -lt 1 ]; then
        usage
    fi
    
    INPUT_FILE="$1"
    OUTPUT_DIR="${2:-.}"  # Default to current directory if not specified
    
    # Check if input file exists
    if [ ! -f "$INPUT_FILE" ]; then
        echo "Error: Input file '$INPUT_FILE' not found!"
        exit 1
    fi
    
    # Get file extension (remove leading dot, convert to lowercase)
    EXT="${INPUT_FILE##*.}"
    EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
    
    # Determine output format based on extension and typical use cases
    # You can modify this logic based on your needs
    case "$EXT" in
        html|htm)
            OUTPUT_FORMAT="docx"  # Convert HTML to DOCX by default
            ;;
        docx|doc|odt)
            OUTPUT_FORMAT="pdf"   # Convert Word docs to PDF by default
            ;;
        xlsx|xls)
            OUTPUT_FORMAT="pdf"   # Convert Excel to PDF by default
            ;;
        pptx|ppt)
            OUTPUT_FORMAT="pdf"   # Convert PowerPoint to PDF by default
            ;;
        *)
            OUTPUT_FORMAT="pdf"   # Default to PDF for other formats
            ;;
    esac
    
    # Get the appropriate filter
    FILTER=$(get_filter "$EXT" "$OUTPUT_FORMAT")
    
    if [ $? -ne 0 ]; then
        exit 1
    fi
    
    # Create output directory if it doesn't exist
    mkdir -p "$OUTPUT_DIR"
    
    # Get output filename
    OUTPUT_FILE=$(get_output_filename "$INPUT_FILE" "$OUTPUT_DIR" "$OUTPUT_FORMAT")
    
    echo "========================================="
    echo "Converting: $INPUT_FILE"
    echo "Extension: .$EXT"
    echo "Output format: $OUTPUT_FORMAT"
    echo "Using filter: $FILTER"
    echo "Output file: $OUTPUT_FILE"
    echo "========================================="
    
    # Perform the conversion
    soffice --headless \
        --convert-to "$FILTER" \
        "$INPUT_FILE" \
        --outdir "$OUTPUT_DIR"
    
    # Check if conversion was successful
    if [ $? -eq 0 ] && [ -f "$OUTPUT_FILE" ]; then
        echo "✅ Conversion successful! Output saved to: $OUTPUT_FILE"
        # Rename if the output filename doesn't match expected (LibreOffice uses original name)
        EXPECTED_OUTPUT="${OUTPUT_DIR}/$(basename "${INPUT_FILE%.*}.${OUTPUT_FORMAT}")"
        if [ "$EXPECTED_OUTPUT" != "$OUTPUT_FILE" ] && [ -f "$EXPECTED_OUTPUT" ]; then
            mv "$EXPECTED_OUTPUT" "$OUTPUT_FILE"
            echo "📝 Renamed to: $OUTPUT_FILE"
        fi
    else
        echo "❌ Conversion failed!"
        exit 1
    fi
}

# Run the main function with all arguments
main "$@"