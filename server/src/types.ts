/*
Position in a text document expressed as zero-based line and zero-based character offset. 
A position is between two characters like an ‘insert’ cursor in an editor. 
*/
export interface Position {
    line: number;
    character: number;
  }
  
export interface Range {
  start: Position;
  end: Position;
}
  