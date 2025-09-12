package com.petcare.sitter;

import java.util.List;

//DTO usado para listar os Sitters + serviços que eles oferecem no frontend
public record SitterListarServicoResponse(
    Long id,
    String name,
    List<SitterServicoResponse> servicos

) {

}
