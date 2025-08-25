package com.petcare.sitter;

import com.petcare.user.User;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true) //para add os campos da superclasser User ao sitter
public class Sitter extends User {


}
 //podemos colocar outros dados que forem necessarios depois

